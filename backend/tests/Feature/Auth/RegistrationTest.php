<?php

namespace Tests\Feature\Auth;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Testing\Fluent\AssertableJson;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_registration_route_can_not_be_accessed()
    {
        $response = $this->followingRedirects()->post('api/auth/register');
        $response->assertStatus(400);
    }

    public function test_registration_route_without_parameters()
    {
        $response = $this->postJson('api/auth/register');
        $response->assertStatus(422);

        $response->assertJsonValidationErrors('first_name');
        $response->assertJsonValidationErrors('last_name');
        $response->assertJsonValidationErrors('email');
        $response->assertJsonValidationErrors('password');
    }


    public function test_new_users_can_not_register_with_invalid_password()
    {
        $response = $this->postJson('api/auth/register', [
            'first_name' => 'Test User',
            'last_name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors('password');
    }

    public function test_new_users_can_register()
    {
        $response = $this->postJson('api/auth/register', [
            'first_name' => 'Test',
            'last_name' => 'User',
            'email' => 'test@gmail.com',
            'password' => 'Password1',
            'device_name' => 'pc'
        ]);

        $response->assertStatus(201);

        $user = $response->json('user');

        $this->assertEquals('Test', $user['first_name']);
        $this->assertEquals('User', $user['last_name']);
        $this->assertEquals('test@gmail.com', $user['email']);
        $this->assertArrayHasKey('id', $user);

        $response->assertJson(fn(AssertableJson $json) => $json->has('user')->has('access_token'));
    }
}
