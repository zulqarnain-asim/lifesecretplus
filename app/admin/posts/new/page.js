import PostForm from "../PostForm";

export const metadata = {
  title: "New post",
  robots: { index: false, follow: false },
};

export default function NewPost() {
  return (
    <>
      <div className="admin-head">
        <div>
          <span className="eyebrow">Content</span>
          <h1>Write a new post</h1>
        </div>
      </div>
      <PostForm />
    </>
  );
}
