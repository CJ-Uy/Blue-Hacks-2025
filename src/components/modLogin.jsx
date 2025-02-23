"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useModeratorStore } from "@/zustand/store";

// This function was partially made with Gen AI
export default function ModLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);
  const [isLoginError, setIsLoginError] = useState(false);

  // Get store functions at component level
  const logIn = useModeratorStore((state) => state.logIn);
  const logOut = useModeratorStore((state) => state.logOut);
  const isLoggedIn = useModeratorStore((state) => state.isLoggedIn);

  async function checkLoginCredentials() {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();

    if (data.valid) {
      setUsername("");
      setPassword("");
      logIn();
      setIsLoginError(false);
      setOpen(false);
    } else {
      setUsername("");
      setPassword("");
      setIsLoginError(true);
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8 text-white"
          viewBox="0 0 24 24"
        >
          <title>Moderator's Login</title>
          <path
            fill="currentColor"
            d="M17 17q.625 0 1.063-.437T18.5 15.5t-.437-1.062T17 14t-1.062.438T15.5 15.5t.438 1.063T17 17m0 3q.775 0 1.425-.363t1.05-.962q-.55-.325-1.175-.5T17 18t-1.3.175t-1.175.5q.4.6 1.05.963T17 20m-5 2q-3.475-.875-5.738-3.988T4 11.1V5l8-3l8 3v5.675q-.475-.2-.975-.363T18 10.076V6.4l-6-2.25L6 6.4v4.7q0 1.175.313 2.35t.875 2.238T8.55 17.65t1.775 1.5q.275.8.725 1.525t1.025 1.3q-.025 0-.037.013T12 22m5 0q-2.075 0-3.537-1.463T12 17t1.463-3.537T17 12t3.538 1.463T22 17t-1.463 3.538T17 22m-5-10.35"
          />
        </svg>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Moderator's Login</h4>
            <p className="text-xs text-muted-foreground">
              Moderators makes sure all reports stay appropriate
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-2 items-center gap-4">
              <Label>Username</Label>
              <Input
                value={username}
                disabled={isLoggedIn}
                onChange={(e) => setUsername(e.target.value)}
                className="col-span-1 h-8"
              />
            </div>
            <div className="grid grid-cols-2 items-center gap-4">
              <Label>Password</Label>
              <Input
                value={password}
                disabled={isLoggedIn}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                className="col-span-1 h-8"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <div />
              <div>
                {isLoginError && (
                  <p className="text-red-500 text-xs">Wrong credentials</p>
                )}
              </div>
              {!isLoggedIn ? (
                <Button
                  className="bg-offBlack text-white"
                  onClick={checkLoginCredentials}
                >
                  Login
                </Button>
              ) : (
                <Button
                  className="bg-offBlack text-white"
                  onClick={() => {
                    logOut();
                    setOpen(false);
                  }}
                >
                  Logout
                </Button>
              )}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
