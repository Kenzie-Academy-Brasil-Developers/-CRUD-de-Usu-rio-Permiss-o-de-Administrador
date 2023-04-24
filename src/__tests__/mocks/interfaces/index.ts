type TUser = {
    id: number
    name: string
    email: string
    admin: boolean
    active: boolean
}

type TUserCreate = Omit<TUser, 'id'> & {
    password: string
}

type TUserWrongCreate = {
    name: number
    email: string
}

type TUserLogin = Omit<TUserCreate, 'admin' | 'active' | 'name'>

export { TUserCreate, TUserWrongCreate, TUserLogin, TUser }
