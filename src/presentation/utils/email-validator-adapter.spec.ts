import validator from 'validator';
import { EmailValidatorAdapter } from './email-validator-adapter';

jest.mock('validator', () => ({
    isEmail (): boolean {
        return true
    }
}));

const makeSut = (): EmailValidatorAdapter => {
    return new EmailValidatorAdapter()
}

describe('EmailValidator Adapter', () => {
    test('Should return false if validator returns false', () => {
        const sut = makeSut();
        jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false); // we don't care how this library validates emails
        // we shouldn't be concerned about, because that is the reason for which we use a wrapper on that library (adapter)
        // EmailValidatorAdapter
        const isValid = sut.isValid('invalid_email@mail.com');
        expect(isValid).toBe(false);
    });

    test('Should return true if validator returns true', () => {
        const sut = makeSut();
        const isValid = sut.isValid('valid_email@mail.com');
        expect(isValid).toBe(true);
    });

    test('Should call validator with correct email', () => {
        const sut = makeSut();
        const isEmailSpy = jest.spyOn(validator, 'isEmail');
        sut.isValid('any_email@mail.com');
        expect(isEmailSpy).toHaveBeenCalledWith('any_email@mail.com');
    });
});