<?php

namespace App\Rules;

use Closure;
//use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Contracts\Validation\Rule;

class WrongPassword implements Rule
{
    public function passes($attribute, $value)
    {
        // Check if the provided password is incorrect
        return !Auth::attempt([
            'email' => request('email'),
            'password' => $value,
        ]);
    }

    public function message()
    {
        return 'The provided password is incorrect.';
    }
}

// class WrongPassword implements ValidationRule
// {
//     /**
//      * Run the validation rule.
//      *
//      * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
//      */
//     public function validate(string $attribute, mixed $value, Closure $fail): void
//     {
//         //
//     }
// }
