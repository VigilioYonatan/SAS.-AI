export type CommentsEntities =
    | "ProductsNormals"
    | "ProductsRestaurants"
    | "ProductsServicios";
export type RatingsEntities =
    | "ProductsNormals"
    | "ProductsRestaurants"
    | "ProductsServicios";
export type ReactionsEntities = "comments" | "subcomments";
export const commentsEntities: CommentsEntities[] = [
    "ProductsNormals",
    "ProductsRestaurants",
    "ProductsServicios",
];
export const ratingsEntities: CommentsEntities[] = [
    "ProductsNormals",
    "ProductsRestaurants",
    "ProductsServicios",
];
export const reactionsEntities: ReactionsEntities[] = [
    "comments",
    "subcomments",
];
