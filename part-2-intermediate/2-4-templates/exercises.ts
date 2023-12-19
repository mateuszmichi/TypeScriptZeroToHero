// Templates

type XYZ = unknown;

/**
 * Create a generic type that could represent the following family of types
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
 * Create generic types that could represent the following family of types
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

/**
 * Use constraints to make this code safe
 */
function Exercise3() {
  // Type of the function
  type ConvertToFullName<T> = (data: T) => {
    surname: string /* define rest */;
  };
  // How it would be implemented
  function convertToFullName<T>(data: T): XYZ {
    const { name, surname, ...rest } = data;
    return {
      fullName: `${name} ${surname}`,
      ...rest,
    };
  }
}

/**
 * Inspect result type - how does this template work?
 * Comment usage that does not make sense and produces never | never
 */
function Exercise4() {
  type FilterTemplate<I, O> = {
    matching: Extract<keyof I, keyof O>[];
    miss: Exclude<keyof I, keyof O>[];
  };

  type A = FilterTemplate<{ name: string }, {}>;
  type B = FilterTemplate<{}, { name: string }>;
  type C = FilterTemplate<{ name: number; value: "v" }, { name: string }>;
  type D = FilterTemplate<{ name: string }, { name: number; value: "v" }>;
}

/**
 * Use ternary expressions to create a template that will:
 * 1. Accept only object types
 * 2. If the key value is a string, it will convert to an object with the same key: string
 * 3. If the key value is an object - run the same logic (recursive)
 * 4. Keep arrays intact for now
 * 5. Other keys will be kept with their original type
 */
function Exercise5() {
  type MapperType<T> = XYZ;

  // Should be { name: { name: string } }
  type A = MapperType<{ name: string }>;
  // Should be { age: number, arr: { name: string }[] }
  type B = MapperType<{ age: number; arr: { name: string }[] }>;
  /* Nested, should be
    {
      parent: {
        child: { surname: { surname: string } };
        other: { other: string };
      }
    }
  */
  type C = MapperType<{
    parent: { child: { surname: string }; other: string };
  }>;
}
