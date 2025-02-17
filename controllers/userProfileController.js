const userProfileService = require("../services/userProfileService");


// Создать профиль
const createProfile = async (req, res) => {
  const userId = req.user.id; // Идентификация пользователя из JWT
  const profileData = req.body;

  try {
    const profile = await userProfileService.createUserProfile(
      userId,
      profileData
    );
    res.status(201).json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create profile" });
  }
};

const upsertProfile = async (req, res) => {
  const userId = req.user.id; // Идентификация пользователя из JWT
  const updates = req.body;

  try {
    // Проверяем, существует ли профиль
    const existingProfile = await userProfileService.getUserProfile(userId);

    if (!existingProfile) {
      // Если профиль не существует, создаем новый
      const newProfile = await userProfileService.createUserProfile(
        userId,
        updates
      );
      return res.status(201).json(newProfile); // Возвращаем статус 201 для нового профиля
    }

    // Если профиль существует, обновляем его
    const updatedProfile = await userProfileService.upsertUserProfile(
      userId,
      updates
    );
    return res.status(200).json(updatedProfile); // Возвращаем статус 200 для обновленного профиля
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update or create profile" });
  }
};

// Удалить профиль
const deleteProfile = async (req, res) => {
  const userId = req.user.id;

  try {
    const deletedProfile = await userProfileService.deleteUserProfile(userId);
    if (!deletedProfile) {
      return res.status(404).json({ error: "Profile not found" });
    }
    res.status(200).json({ message: "Profile deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete profile" });
  }
};

// Получить профиль
const getProfile = async (req, res) => {
  const userId = req.user.id;

  console.log('getProfile', userId);

  try {
    const profile = await userProfileService.getUserProfile(userId);

    // Если профиль не найден, возвращаем пустой объект
    if (!profile) {
      return res.status(200).json({
        userId,
        username: "",
        website: "",
        description: "",
        avatarUrl: "",
        followers: 0,
        following: 0,
      });
    }

    res.status(200).json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};
const uploadAvatar = async (req, res) => {
  const userId = req.user.id;

  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  const avatarUrl = `/uploads/avatars/${req.file.filename}`;

  try {
    // Обновляем профиль пользователя с новым URL аватара
    const updatedProfile = await userProfileService.upsertUserProfile(userId, {
      avatarUrl,
    });

    res.status(200).json(updatedProfile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to upload avatar" });
  }
};

const getAvatar = async (req, res) => {
  const userId = req.user.id;
  console.log("TESt1", userId);

  try {
    res
      .status(200)
      .json({ avatarUrl: await userProfileService.getUserAvatar(userId) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch avatar" });
  }
};

const getProfileById = async (req, res) => {
  const { userId } = req.params; // Получаем ID пользователя из параметров маршрута

  try {
    const profile = await userProfileService.getUserProfile(userId);

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.status(200).json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch profile by ID" });
  }
};

const getAvatarByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const avatarUrl = await userProfileService.getUserAvatar(userId);

    if (!avatarUrl) {
      return res.status(404).json({ error: "Avatr not found" });
    }

    res.status(200).json(avatarUrl);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch profile by ID" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userProfileService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

module.exports = {
  createProfile,
  upsertProfile,
  deleteProfile,
  getProfile,
  uploadAvatar,
  getAvatarByUserId,
  getProfileById,
  getAvatar,
  getAllUsers
};
