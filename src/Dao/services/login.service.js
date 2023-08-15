import { UserModel } from "../models/login.models.js";

class LoginService {
  async registerUser(userData) {
    try {
      const user = await UserModel.create(userData);
      return user;
    } catch (error) {
      throw new Error("Error al registrar el usuario");
    }
  }

  async findUserByEmail(email) {
    try {
      const user = await UserModel.findOne({ email });
      return user;
    } catch (error) {
      throw new Error("Error al buscar el usuario por email");
    }
  }

}

export const loginService = new LoginService();