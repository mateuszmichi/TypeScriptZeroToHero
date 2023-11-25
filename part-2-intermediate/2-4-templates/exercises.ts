// Templates

type XYZ = unknown;

/**
 * Create a generic type that could represent the following types
 */
function Exercise1() {
  type UserDetailsResponse = {
    status: 200;
    body: { id: number; username: string };
  };
  type FailingResponse1 = { status: 403; reason: "Unauthorized" };
  type FailingResponse2 = { status: 400; reason: "Bad request" };
  type UpdatePostResponse = { status: 200; body: { published: boolean } };
  type DeleteCommentResponse = { status: 200; body: { id: number } };
}

/**
 * Create generic types that could represent the following types
 */
function Exercise2() {
  type UserData = { id: number; username: string };
  type CompareUser = {
    input: UserData;
    output: UserData;
    check: (
      a: UserData,
      b: UserData,
    ) => { same: true } | { same: false; diff: Array<"id" | "username"> };
  };

  type PostData = { title: string; date: Date; authorId: number };
  type ComparePost = {
    input: PostData;
    output: PostData;
    check: (
      a: PostData,
      b: PostData,
    ) =>
      | { same: true }
      | { same: false; diff: Array<"title" | "date" | "authorId"> };
  };
}
