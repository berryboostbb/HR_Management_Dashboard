import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
const Login = lazy(() => import("../pages/login"));

export default function AuthRoutes() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <p className="text-4xl font-medium">Loading-----</p>
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
    </Suspense>
  );
}
