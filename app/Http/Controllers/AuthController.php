<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\SignupRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Auth\Events\Registered;

class AuthController extends Controller
{
    public function signup(SignupRequest $request)
    {
        $data = $request->validated();

        /** @var \App\Models\User $user */ 
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password']
        ]);
        $token = $user->createToken('main')->plainTextToken;

        return response([
            'user' => $user,
            'token' => $token
        ]);
        //event(new Registered($user));

        return response([
            'message' => 'Registration successful. Please check your email for verification.',
        ]);
    }

    public function login(LoginRequest $request)
    {
        $credentials = $request->validated();
        $remember = $credentials['remember'] ?? false;

        unset($credentials['remember']);

        if(!Auth::attempt($credentials, $remember)) {
            return response([
                'error' => 'The provided credentials are not correct'
            ], 422);
        }
        $user = Auth::user();
        $token = $user->createToken('main')->plainTextToken;

        return response([
            'user' => $user,
            'token' => $token
        ]);
    }

    public function logout(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();
        //Revoke the token that was used to authenticate the current request...
        $user->currentAccessToken()->delete();

        return response([
            'success' => true
        ]);
    }

    public function me(Request $request)
    {
        return $request->user();
    }
}
