import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

/**
 * Handles authentication HTTP routes.
 */
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	/**
	 * Create a user account and return a JWT token.
	 */
	@Post('signup')
	signup(@Body() signupDto: SignupDto) {
		return this.authService.signup(signupDto);
	}

	/**
	 * Authenticate existing user and return a JWT token.
	 */
	@Post('login')
	login(@Body() loginDto: LoginDto) {
		return this.authService.login(loginDto);
	}
}
