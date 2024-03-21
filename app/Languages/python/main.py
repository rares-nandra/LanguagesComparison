import sys

def is_prime(number: int) -> None:
    if number == 2:
        return True
    
    if number < 2 or number % 2 == 0:
        return False
    
    for divisor in range(3, int(number**0.5) + 1, 2):
        if number % divisor == 0:
            return False
    
    return True
    
if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python main.py upper_limit")
        sys.exit(1)
    
    try:
        upper_limit = int(sys.argv[1])
    except ValueError:
        print("Error: upper_limit must be an integer")
        sys.exit(1)

    for number in range(upper_limit):
        if is_prime(number):
            print(number, end=',')