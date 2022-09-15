export interface UserInfo {
    code: number,
    nickname: string
}

export interface Board {
    boardId: string,
    boardName: string,
    subBoardId: string | null,
    subBoardName: string | null,
    categoryList: {
        [index: string]: Category
    }
}

export interface Category {
    id: string,
    name: string
}

export interface Post {
    id: number,
    user: UserInfo,
    category: string | null,
    title: string,
    createdAt: string,
    hit: number,
    totalComments: number,
    totalLikes: number
}

export interface DetailPost extends Post {
    content: string,
    permission: boolean,
    like: boolean
}

export interface BoardListRes extends Omit<Board, 'categoryList'> {
    categoryList: Category[]
}

export interface PostListRes {
    posts: Post[],
    totalPages: number,
    page: number,
    limit: number
}