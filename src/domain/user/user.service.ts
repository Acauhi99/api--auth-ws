import User from "./user.model";

const syncUserModel = async () => {
  try {
    await User.sync({ force: false });
    console.log("Modelo User sincronizado com sucesso.");
  } catch (error) {
    console.error("Erro ao sincronizar o modelo User:", error);
  }
};

export { syncUserModel };
