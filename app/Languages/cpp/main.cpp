#include <iostream>
#include <cstdlib>

bool isPrime(long long number)
{
    if(number == 2)
    {
        return true;
    }

    if(number < 2 or number % 2 == 0)
    {
        return false;
    }

    for(long long divisor = 3; divisor * divisor <= number; divisor += 2)
    {
        if(number % divisor == 0)
        {
            return false;
        }
    }

    return true;
}

int main(int argc, char *argv[])
{
    if(argc != 2)
    {
        std::cerr << "Usage: " << argv[0] << " upper_limit" << std::endl;
        return 1;
    }

    const long long upper_limit = std::atoi(argv[1]);

    for(long long number = 0; number < upper_limit; number++)
    {
        if(isPrime(number))
        {
            std::cout << number << ",";
        }
    }

    return 0;
}