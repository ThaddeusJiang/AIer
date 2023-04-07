import { Fragment } from "react";

import Link from "next/link";
import { useRouter } from "next/router";

import { Menu, Transition } from "@headlessui/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

import classNames from "classnames";

import { Logo } from "~/components/lp/Logo";
import { useUser } from "~/utils/useUser";

export const Navbar = () => {
  const router = useRouter();
  const supabaseClient = useSupabaseClient();
  const { user, userDetails } = useUser();

  return (
    <nav className="transition-all duration-150">
      <a href="#skip" className="sr-only focus:not-sr-only">
        Skip to content
      </a>
      <div className="mx-auto max-w-6xl px-6">
        <div className="align-center relative flex flex-row justify-between py-4 md:py-6 ">
          <div className="flex flex-1 items-center space-x-2">
            <Link
              href={user ? "/home" : "/"}
              className="transform cursor-pointer duration-100 ease-in-out "
              aria-label="Logo"
            >
              <Logo />
            </Link>

            <Link href="/avatars" className="link">
              Avatars
            </Link>
          </div>

          <div className="flex flex-1 justify-end space-x-8">
            {user ? (
              // <span
              //   className={s.link}
              //   onClick={async () => {
              //     await supabaseClient.auth.signOut();
              //     router.push('/signin');
              //   }}
              // >
              //   Sign out
              // </span>
              <>
                {/* Right section on desktop */}
                <div className="hidden lg:ml-4 lg:flex lg:items-center lg:pr-0.5">
                  {/* <button
                      type="button"
                      className="flex-shrink-0 p-1 text-indigo-200 rounded-full hover:text-white hover:bg-white hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-white"
                    >
                      <span className="sr-only">View notifications</span>
                      <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </button> */}

                  {/* Profile dropdown */}
                  <Menu as="div" className="relative ml-4 flex-shrink-0">
                    {({ open: isUserMenuOpen }) => (
                      <>
                        <div>
                          <Menu.Button className="flex rounded-full bg-white text-sm ring-2 ring-white ring-opacity-20 focus:outline-none focus:ring-opacity-100">
                            <span className="sr-only">Open user menu</span>
                            <img className="h-8 w-8 rounded-full" src={userDetails?.avatar_url} alt={"User"} />
                          </Menu.Button>
                        </div>
                        <Transition
                          show={isUserMenuOpen}
                          as={Fragment}
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items
                            static
                            className="absolute -right-2 z-40 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                          >
                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  href="/settings/profile"
                                  className={classNames(
                                    active ? "bg-gray-100" : "",
                                    "block px-4 py-2 text-sm text-gray-700"
                                  )}
                                >
                                  Your Profile
                                </Link>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  href="/settings/billing"
                                  className={classNames(
                                    active ? "bg-gray-100" : "",
                                    "block px-4 py-2 text-sm text-gray-700"
                                  )}
                                >
                                  Settings
                                </Link>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              <Link href="/settings/pricing" className="block px-4 py-2 text-sm text-gray-700">
                                Pricing
                              </Link>
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <div
                                  role="button"
                                  className={classNames(
                                    active ? "bg-gray-100" : "",
                                    "block px-4 py-2 text-sm text-gray-700"
                                  )}
                                  onClick={async (e) => {
                                    e.preventDefault();
                                    await supabaseClient.auth.signOut();
                                    router.push("/signin");
                                  }}
                                  aria-hidden="true"
                                >
                                  Sign out
                                </div>
                              )}
                            </Menu.Item>
                          </Menu.Items>
                        </Transition>
                      </>
                    )}
                  </Menu>
                </div>
              </>
            ) : (
              <Link href="/signin" className="link">
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
