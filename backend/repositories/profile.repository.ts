export const profileRepository = {
  async findById(): Promise<null> {
    return null;
  },

  async findByEmail(): Promise<null> {
    return null;
  },

  async updateRole(): Promise<never> {
    throw new Error("profiles não é usado neste modo (auth simples por JWT admin)." );
  },
};
