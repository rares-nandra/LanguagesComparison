import json
import os
import subprocess
import time

class LanguagesManager:
    def __init__(self, languages_directory: str, config_file_name: str) -> None:
        with open(os.path.join(languages_directory, config_file_name)) as f:
            languages_config = json.load(f)
            
            for language_info in languages_config["Languages"].values():
                language_info["Location"] = os.path.join(languages_directory, language_info["Location"])

                if language_info["RequiresCompilation"]:
                    compiled_file = os.path.splitext(language_info["Location"])[0]
                    language_info["Commands"]["Compile"] = language_info["Commands"]["Compile"].replace("<<COMPILED_FILE>>", compiled_file).replace("<<CODE_FILE>>", language_info["Location"])
                    language_info["Commands"]["Run"] = language_info["Commands"]["Run"].replace("<<COMPILED_FILE>>", compiled_file)
                else:
                    language_info["Commands"]["Run"] = language_info["Commands"]["Run"].replace("<<CODE_FILE>>", language_info["Location"])

            self.languages_info = languages_config["Languages"]
            self.expected_output = languages_config["ExpectedOutput"]
            self.preferences = languages_config["Preferences"]
        
    def get_url_and_paths(self) -> list:
        url_and_paths = []
        
        for language, info in self.languages_info.items():
            if "URLsafeName" in info:
                url_and_paths.append({"Language": language, "url": info["URLsafeName"], "Path": info["Location"]})
            else:
                url_and_paths.append({"Language": language, "url": language, "Path": info["Location"]})
        return url_and_paths

    def compile_all(self, update_callback: callable=None) -> dict:
        start_time = time.time()
        results = {}
        stats = {}
        compiled_languages = 0
        interpreted_languages = 0
        failed_to_compile = 0
        compilation_times = []
        compiled_sizes = []
        interpreted_sizes = []
 
        for language in self.languages_info:
            results[language] = self.compile_language(language)

            if results[language]["Info"] == "No compilation required":
                interpreted_languages = interpreted_languages + 1
                interpreted_sizes.append({"Language": language, "Size": results[language]["Size"]})
            else:
                compiled_languages = compiled_languages + 1
                compiled_sizes.append({"Language": language, "Size": results[language]["Size"]})

                if results[language]["Successful"] == True:
                    compilation_times.append({"Language": language, "Time": results[language]["Time"]})
            
            if results[language]["Successful"] == False:
                failed_to_compile = failed_to_compile + 1

            if update_callback is not None:
                update_callback({language: results[language]})

        stats = {
            "TotalTime": time.time() - start_time,
            "Total": interpreted_languages + compiled_languages,
            "CompiledLanguages": compiled_languages,
            "InterpretedLanguages": interpreted_languages,
            "FailedToCompile": failed_to_compile,
            "CompilationTimes": compilation_times,
            "CompiledSizes": compiled_sizes,
            "InterpretedSizes": interpreted_sizes 
        }

        return {"Results": results, "Stats": stats}

    def compile_language(self, language_name: str) -> dict:
        language_info = self.languages_info[language_name]

        if not language_info["RequiresCompilation"]:
            return {"Time": 0, "Size": os.path.getsize(language_info["Location"]), "Successful": True, "Info": "No compilation required"}

        start_time = time.time()

        compile_result = subprocess.run(language_info["Commands"]["Compile"], shell=True, capture_output=True, text=True)
        
        if compile_result.returncode == 0:
            return {"Time": time.time() - start_time, "Size": (os.path.getsize(os.path.splitext(language_info["Location"])[0])), "Successful": True, "Info": language_name + " compiled successfully"}
        else:
            return {"Time": time.time() - start_time, "Size": 0, "Successful": False, "Info": str(compile_result.stderr)}
        
    def run_all(self, update_callback: callable=None) -> dict:
        start_time = time.time()
        results = {}
        stats = {}
        failed_to_run = 0
        wrong_output = 0
        timed_out = 0
        run_times = []

        for language in self.languages_info:
            results[language] = self.run_language(language)

            if results[language]["Output"] == "Timeout":
                timed_out = timed_out + 1
            elif results[language]["Successful"] == False:
                failed_to_run = failed_to_run + 1
            elif results[language]["ValidOutput"] == False:
                wrong_output = wrong_output + 1
            else:
                run_times.append({"Language": language, "Time": results[language]["Time"]})

            if update_callback is not None:
                update_callback({language: results[language]})

        stats = {
            "TotalTime": time.time() - start_time,
            "Total": len(results.keys()),
            "FailedToRun": failed_to_run,
            "WrongOutput": wrong_output,
            "Timedout": timed_out,
            "RunTimes": run_times,
        }

        return {"Results": results, "Stats": stats}

    def run_language(self, language_name: str) -> dict:
        self.language_info = self.languages_info[language_name]
        full_run_command = self.language_info["Commands"]["Run"] + " " + self.preferences["RunArgs"]
        
        start_time = time.time()
        
        try:
            run_result = subprocess.run(full_run_command, shell=True, capture_output=True, text=True, timeout=self.preferences["Timeout"])
        except subprocess.TimeoutExpired as e:
            return {"Time": time.time() - start_time, "Successful": False, "ValidOutput": False, "Output": "Timeout"}
            
        if run_result.returncode != 0:
            return {"Time": time.time() - start_time, "Successful": False, "ValidOutput": False, "Output": str(run_result.stderr)}
        
        if str(run_result.stdout.strip()) != self.expected_output:
            return {"Time": time.time() - start_time, "Successful": True, "ValidOutput": False, "Output": str(run_result.stdout.strip())}
                
        return {"Time": time.time() - start_time, "Successful": True, "ValidOutput": True, "Output": "The expected output"}