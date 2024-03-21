#include <stdio.h>
#include <stdlib.h>

int isPrime(long long number)
{
    if (number == 2)
    {
        return 1;
    }

    if (number < 2 || number % 2 == 0)
    {
        return 0;
    }

    for (long long divisor = 3; divisor * divisor <= number; divisor += 2)
    {
        if (number % divisor == 0)
        {
            return 0;
        }
    }

    return 1;
}

int main(int argc, char *argv[])
{
    if (argc != 2)
    {
        fprintf(stderr, "Usage: %s upper_limit\n", argv[0]);
        return 1;
    }

    const long long upper_limit = atoll(argv[1]);

    for (long long number = 0; number < upper_limit; number++)
    {
        if (isPrime(number))
        {
            printf("%lld,", number);
        }
    }

    return 0;
}
