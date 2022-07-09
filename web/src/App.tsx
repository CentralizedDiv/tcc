import "antd/dist/antd.min.css";
import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAppDispatch } from "./config/store";
import { ProtectedLayout } from "./layout/protected/protected.layout";
import { PublicLayout } from "./layout/public/public.layout";
import { LoginCT } from "./pages/auth/login.container";
import { getUser } from "./pages/auth/store/auth.actions";
import { authenticate, STORAGE_KEY_TOKEN } from "./pages/auth/store/authSlice";
import { CommentsCT } from "./pages/comments/comments.container";
import { DiscussionsCT } from "./pages/discussions/discussions.container";
import { SystemsCT } from "./pages/systems/systems.container";
import { ProfileCT } from "./pages/profile/profile.container";
import { SignupCT } from "./pages/auth/signup.container";

export const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEY_TOKEN);
    if (token) {
      dispatch(authenticate({ token }));
      dispatch(getUser());
    }
  }, [dispatch]);

  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Navigate replace to="/login" />} />
        <Route path="/login" element={<LoginCT />} />
        <Route path="/signup" element={<SignupCT />} />
      </Route>

      <Route element={<ProtectedLayout />}>
        <Route path="discussions" element={<DiscussionsCT />} />
        <Route path="systems" element={<SystemsCT />} />
        <Route path="comments" element={<CommentsCT />} />
        <Route path="profile" element={<ProfileCT />} />
        <Route path="*" element={<Navigate replace to="/discussions" />} />
      </Route>
    </Routes>
  );
};
