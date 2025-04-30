import { AdminUser } from "../interfaces/admin_user.interface";
import { UserUpdateData } from "../components/UserDetailsModal";
import { api } from "../../../login/services/api";

export const fetchUsers = async (): Promise<AdminUser[]> => {
  try {
    const response = await api.get(`/admin/users`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const updateUserDetails = async (
  userData: UserUpdateData
): Promise<AdminUser> => {
  try {
    // First update the user role
    const userResponse = await api.patch(
      `/admin/users/${userData.id}`,
      { role: userData.role }
    );

    // Then update agency assignments
    await api.post(
      `/admin/users/${userData.id}/bulk-agency-assignments`,
      { agencyIds: userData.agencyIds }
    );

    return userResponse.data;
  } catch (error) {
    console.error("Error updating user details:", error);
    throw error;
  }
};

export const assignAgencyToUser = async (assignData: {
  userId: string;
  agencyId: string;
}): Promise<any> => {
  try {
    const response = await api.post(
      `/admin/users/${assignData.userId}/agencies`,
      {
        agencyId: assignData.agencyId,
        role: "manager", // Always use manager role
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error assigning agency to user:", error);
    throw error;
  }
};

export const removeAgencyFromUser = async ({
  userId,
  agencyId,
}: {
  userId: string;
  agencyId: string;
}): Promise<void> => {
  try {
    await api.delete(
      `/admin/users/${userId}/agencies/${agencyId}`
    );
  } catch (error) {
    console.error("Error removing agency from user:", error);
    throw error;
  }
};
