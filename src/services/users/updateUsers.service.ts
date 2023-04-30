import format from "pg-format";
import { TUserUpdated } from "../../interfaces/users.interface";
import { responseUserSchema } from "../../schemas/users.schema";
import { client } from "../../database";
import { QueryConfig } from "pg";

const updateUsersService = async (id: number, userData: TUserUpdated) => {
  const queryTemplate = format(
    `
        UPDATE 
            users
        SET 
            (%I) = ROW (%L)
        WHERE
            id = $1
        RETURNING *;
        `,
    Object.keys(userData),
    Object.values(userData)
  );

  const queryConfig: QueryConfig = {
    text: queryTemplate,
    values: [id],
  };

  const queryResultTemplate = await client.query(queryConfig);

  const updatedUser = responseUserSchema.parse(queryResultTemplate.rows[0]);

  return updatedUser;
};

export default updateUsersService;
