'use client';
import EnhancedHome from "./components/EnhancedHome";
import CursorFollower from "./components/CursorFollower";

export default function Page() {
  return (
    <>
      <CursorFollower />
      <div className="flex items-center justify-center h-screen relative">
        <EnhancedHome />
      </div>
    </>
  );
}