import { MissingParamError } from '../errors/missing-param-error';
import { httpResponse, HttpRequest } from '../protocols/http.interface';
import { badRequest } from '../helpers/http-helper';

export class SignUpController {
  handle(httpRequest: HttpRequest): httpResponse {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation'];
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field));
      }
    }

    return badRequest(new MissingParamError('name'));
  }
}
