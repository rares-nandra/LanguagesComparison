const actionButton = document.getElementById("ActionButton");
let actionButtonState = "Compilation";
const compilationSection = document.getElementById("CompilationSection");
const compilationUpdateBoxContent = document.getElementById("CompilationUpdateBoxContent");
const runSection = document.getElementById("RunSection");
const runUpdateBoxContent = document.getElementById("RunUpdateBoxContent");

load();

function load()
{
    startSocketIOConnection();
}

function handleActionButton()
{
    document.body.style.overflowY = "scroll";

    if(actionButtonState === "Loading")
    {
        return;
    }

    if(actionButtonState === "Compilation")
    {
        startCompilation();
    }

    if(actionButtonState === "Run")
    {
        startRunning();
    }

    if(actionButton === "Finished")
    {
        
    }
}

function startCompilation()
{
    actionButtonState = "Loading";
    actionButton.innerHTML = '<p class = "action-button-text text" id = "ActionButtonText">Loading...</p>';
    socketsSendMessage("COMPILATION_START", true);
    compilationSection.classList.remove("hidden");
    compilationSection.style.maxHeight = "none";
    runSection.classList.add("hidden");
    runSection.style.maxHeight = "0px";
    compilationUpdateBoxContent.innerHTML = compilationUpdateBoxContent.innerHTML + "<p class = 'text update-box-text'>Starting compilation...</p>";
}

function handleCompilationUpdates(update)
{
    let language = Object.keys(update)[0]
    let details = update[language];
    let updateText = language + " | compilation time: " + details.Time + " seconds | disk size: " + details.Size + " bytes | Successful: " + details.Successful + " | Info: " + details.Info;
    
    if(details.Successful === true)
    {
        compilationUpdateBoxContent.innerHTML = compilationUpdateBoxContent.innerHTML + "<p class = 'text update-box-text'>" + updateText + "</p>";
        return;
    }
    
    compilationUpdateBoxContent.innerHTML = compilationUpdateBoxContent.innerHTML + "<p class = 'text update-box-text error-text'>" + updateText + "</p>";
}

function handleCompilationEnded(results)
{
    let stats = results[Object.keys(results)[1]]

    compilationUpdateBoxContent.innerHTML = compilationUpdateBoxContent.innerHTML + "<p class = 'text update-box-text success-text'>Compilation finished in " + stats.TotalTime + " seconds</p>";

    compilationUpdateBoxContent.innerHTML = compilationUpdateBoxContent.innerHTML + "<p class = 'text update-box-text'></p>";
    compilationUpdateBoxContent.innerHTML = compilationUpdateBoxContent.innerHTML + "<p class = 'text update-box-text'>|  RESULTS  |</p>";
    compilationUpdateBoxContent.innerHTML = compilationUpdateBoxContent.innerHTML + "<p class = 'text update-box-text'></p>";
    compilationUpdateBoxContent.innerHTML = compilationUpdateBoxContent.innerHTML + "<p class = 'text update-box-text'>" + "Total languages: " + stats.Total + "</p>";
    compilationUpdateBoxContent.innerHTML = compilationUpdateBoxContent.innerHTML + "<p class = 'text update-box-text'>" + "Interpreted: " + stats.InterpretedLanguages + "</p>";
    compilationUpdateBoxContent.innerHTML = compilationUpdateBoxContent.innerHTML + "<p class = 'text update-box-text'>" + "Compiled: " + stats.CompiledLanguages + "</p>";
    compilationUpdateBoxContent.innerHTML = compilationUpdateBoxContent.innerHTML + "<p class = 'text update-box-text'>" + "Failed to compile: " + stats.FailedToCompile + "</p>";
    
    actionButtonState = "Run";
    actionButton.innerHTML = '<p class = "action-button-text text" id = "ActionButtonText">Run All</p>';

    makeCompiledCharts(stats.CompilationTimes, stats.CompiledSizes, stats.InterpretedSizes);
}

function makeCompiledCharts(compilationTimes, compiledSizes, interpretedSizes)
{
    var ctxTimes = document.getElementById('CompilationTimesChart').getContext('2d');
    var timesChart = new Chart(ctxTimes, {
        type: 'bar',
        data: {
            labels: compilationTimes.map(item => item.Language),
            datasets: [{
                label: 'Compilation Time',
                data: compilationTimes.map(item => item.Time),
                backgroundColor: 'rgba(236,134,190, 1)',
                borderColor: 'rgb(180, 180, 180)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.2)'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.2)'
                    }
                }
            }
        }
    });

    var ctxSizes = document.getElementById('CompiledSizesChart').getContext('2d');
    var sizesChart = new Chart(ctxSizes, {
        type: 'bar',
        data: {
            labels: compiledSizes.map(item => item.Language),
            datasets: [{
                label: 'Compiled Size',
                data: compiledSizes.map(item => item.Size),
                backgroundColor: 'rgba(71,175,231,1)',
                borderColor: 'rgb(180, 180, 180)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.2)'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.2)'
                    }
                }
            }
        }
    });

    var ctxInterpretedSizes = document.getElementById('InterpretedSizesChart').getContext('2d');
    var interpretedSizesChart = new Chart(ctxInterpretedSizes, {
        type: 'bar',
        data: {
            labels: interpretedSizes.map(item => item.Language),
            datasets: [{
                label: 'Interpreted Size',
                data: interpretedSizes.map(item => item.Size),
                backgroundColor: 'rgba(236,134,190, 1)',
                borderColor: 'rgb(180, 180, 180)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.2)'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.2)'
                    }
                }
            }
        }
    });
}

function startRunning()
{
    actionButtonState = "Loading";
    actionButton.innerHTML = '<p class = "action-button-text text" id = "ActionButtonText">Loading...</p>';
    socketsSendMessage("RUN_START", true);
    runSection.classList.remove("hidden");
    runSection.style.maxHeight = "none";
    compilationSection.classList.add("hidden");
    compilationSection.style.maxHeight = "0px";
    runUpdateBoxContent.innerHTML = runUpdateBoxContent.innerHTML + "<p class = 'text update-box-text'>Started running languages...</p>";
}

function handleRunUpdates(update)
{
    let language = Object.keys(update)[0]
    let details = update[language];
    let updateText = language + " | Run time: " + details.Time + " seconds | Successful: " + details.Successful + " | Correct output: " + details.ValidOutput + " | Output: " + details.Output;
    
    if(details.Successful === true)
    {
        runUpdateBoxContent.innerHTML = runUpdateBoxContent.innerHTML + "<p class = 'text update-box-text'>" + updateText + "</p>";
        return;
    }
    
    runUpdateBoxContent.innerHTML = runUpdateBoxContent.innerHTML + "<p class = 'text update-box-text error-text'>" + updateText + "</p>";
}

function handleRunEnded(results)
{
    let stats = results[Object.keys(results)[1]]

    runUpdateBoxContent.innerHTML = runUpdateBoxContent.innerHTML + "<p class = 'text update-box-text success-text'>Running finished in " + stats.TotalTime + " seconds</p>";

    runUpdateBoxContent.innerHTML = runUpdateBoxContent.innerHTML + "<p class = 'text update-box-text'></p>";
    runUpdateBoxContent.innerHTML = runUpdateBoxContent.innerHTML + "<p class = 'text update-box-text'>|  RESULTS  |</p>";
    runUpdateBoxContent.innerHTML = runUpdateBoxContent.innerHTML + "<p class = 'text update-box-text'></p>";
    runUpdateBoxContent.innerHTML = runUpdateBoxContent.innerHTML + "<p class = 'text update-box-text'>" + "Total languages: " + stats.Total + "</p>";
    runUpdateBoxContent.innerHTML = runUpdateBoxContent.innerHTML + "<p class = 'text update-box-text'>" + "Failed to run: " + stats.FailedToRun + "</p>";
    runUpdateBoxContent.innerHTML = runUpdateBoxContent.innerHTML + "<p class = 'text update-box-text'>" + "Wrong output (see Languages/Config.json for the ExpectedOutput constant): " + stats.WrongOutput + "</p>";
    runUpdateBoxContent.innerHTML = runUpdateBoxContent.innerHTML + "<p class = 'text update-box-text'>" + "Timed out (see Languages/Config.json for the Timeout constant): " + stats.Timedout + "</p>";
    
    actionButtonState = "Finished";
    actionButton.innerHTML = '<p class = "action-button-text text" id = "ActionButtonText">See results below</p>';

    makeRunCharts(stats.RunTimes);
}

function makeRunCharts(RunTimes)
{
    var a = document.getElementById('RunTimesChart').getContext('2d');
    var runtimesChart = new Chart(a, {
        type: 'bar',
        data: {
            labels: RunTimes.map(item => item.Language),
            datasets: [{
                label: 'Runtime',
                data: RunTimes.map(item => item.Time),
                backgroundColor: 'rgba(236,134,190, 1)',
                borderColor: 'rgb(180, 180, 180)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.2)'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.2)'
                    }
                }
            }
        }
    });
}