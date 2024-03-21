function isPrime(number)
{
    if(number === 2)
    {
        return true;
    }

    if(number < 2 || number % 2 === 0)
    {
        return false;
    }

    for(let divisor = 3; divisor * divisor <= number; divisor += 2)
    {
        if(number % divisor === 0)
        {
            return false;
        }
    }

    return true;
}

function main()
{
    const upperLimit = parseInt(process.argv[2]);

    if(isNaN(upperLimit) || upperLimit < 2)
    {
        console.error('Invalid upper limit. Please provide a valid integer greater than 1.');
        process.exit(1);
    }
    
    for(let number = 0; number < upperLimit; number++)
    {
        if(isPrime(number))
        {
            process.stdout.write(String(number) + ",");
        }
    }
}

main()