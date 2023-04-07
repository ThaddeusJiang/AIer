import { Fragment } from "react";

import Link from "next/link";
import { useRouter } from "next/router";

import { Menu, Popover, Transition } from "@headlessui/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

import clsx from "clsx";

import { Button } from "~/components/lp/Button";
import { Container } from "~/components/lp/Container";
import { Logo } from "~/components/lp/Logo";
import { NavLink } from "~/components/lp/NavLink";
import { useUser } from "~/utils/useUser";

function MobileNavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Popover.Button as={Link} href={href} className="block w-full p-2">
      {children}
    </Popover.Button>
  );
}

function MobileNavIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="h-3.5 w-3.5 overflow-visible stroke-slate-700"
      fill="none"
      strokeWidth={2}
      strokeLinecap="round"
    >
      <path d="M0 1H14M0 7H14M0 13H14" className={clsx("origin-center transition", open && "scale-90 opacity-0")} />
      <path d="M2 2L12 12M12 2L2 12" className={clsx("origin-center transition", !open && "scale-90 opacity-0")} />
    </svg>
  );
}

function MobileNavigation() {
  const router = useRouter();
  const supabaseClient = useSupabaseClient();
  const { user, userDetails } = useUser();

  return (
    <Popover>
      <Popover.Button
        className="relative z-10 flex h-8 w-8 items-center justify-center [&:not(:focus-visible)]:focus:outline-none"
        aria-label="Toggle Navigation"
      >
        {({ open }) => <MobileNavIcon open={open} />}
      </Popover.Button>
      <Transition.Root>
        <Transition.Child
          as={Fragment}
          enter="duration-150 ease-out"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="duration-150 ease-in"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Popover.Overlay className="fixed inset-0 bg-slate-300/50" />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="duration-150 ease-out"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="duration-100 ease-in"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Popover.Panel
            as="div"
            className="absolute inset-x-0 top-full mt-4 flex origin-top flex-col rounded-2xl bg-white p-4 text-lg tracking-tight text-slate-900 shadow-xl ring-1 ring-slate-900/5"
          >
            {user ? (
              <>
                <MobileNavLink href="/home">Home</MobileNavLink>
                <MobileNavLink href="/avatars">Avatars</MobileNavLink>
                <hr className="m-2 border-slate-300/40" />
                <MobileNavLink href="/settings/profile">Your Profile</MobileNavLink>
                <MobileNavLink href="/settings/pricing">Pricing</MobileNavLink>
                <hr className="m-2 border-slate-300/40" />
                <Popover.Button
                  onClick={async (e) => {
                    e.preventDefault();
                    await supabaseClient.auth.signOut();
                    router.push("/signin");
                  }}
                  className="block w-full p-2"
                >
                  Sign out
                </Popover.Button>
              </>
            ) : (
              <>
                {/* <MobileNavLink href="/#features">Features</MobileNavLink>
                <MobileNavLink href="/#testimonials">Testimonials</MobileNavLink> */}
                <MobileNavLink href="/#avatars">Avatars</MobileNavLink>
                <MobileNavLink href="/#pricing">Pricing</MobileNavLink>
                <hr className="m-2 border-slate-300/40" />
                <MobileNavLink href="/signin">Sign in</MobileNavLink>
              </>
            )}
          </Popover.Panel>
        </Transition.Child>
      </Transition.Root>
    </Popover>
  );
}

export function Header() {
  const router = useRouter();
  const supabaseClient = useSupabaseClient();
  const { user, userDetails } = useUser();

  return (
    <header className="py-2 sm:pt-8">
      <Container>
        <nav className="relative z-50 flex justify-between ">
          <div className="flex items-center md:gap-x-12">
            <Link href={user ? "/home" : "/"} aria-label="Home">
              <Logo className="h-10 w-auto" />
            </Link>
            {user ? (
              <div className="hidden md:flex md:gap-x-6">
                <NavLink href="/home">Home</NavLink>
                <NavLink href="/avatars">Avatars</NavLink>
              </div>
            ) : (
              <div className="hidden md:flex md:gap-x-6">
                {/* <NavLink href="/#features">Features</NavLink>
                <NavLink href="/#testimonials">Testimonials</NavLink> */}
                <NavLink href="/#avatars">Avatars</NavLink>
                <NavLink href="/#pricing">Pricing</NavLink>
              </div>
            )}
          </div>
          <div className="flex items-center">
            {user ? (
              <>
                {/* Right section on desktop */}
                <div className="hidden md:ml-4 md:flex md:items-center md:pr-0.5">
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
                          <Menu.Button className="flex items-center space-x-2 text-lg tracking-tight text-slate-900 ">
                            <span className="sr-only">Open user menu</span>

                            {userDetails?.avatar_url ? (
                              <>
                                <img
                                  className="mx-auto h-8 w-8 rounded-full"
                                  src={userDetails.avatar_url}
                                  alt={`Avatar of ${userDetails.full_name}`}
                                />
                              </>
                            ) : (
                              <>
                                <div className="avatar">
                                  <div className="w-24 rounded-full">{userDetails?.full_name?.[0]}</div>
                                </div>
                              </>
                            )}
                            <span>Personal</span>
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
                                  className={clsx(
                                    active ? "bg-gray-100" : "",
                                    "block px-4 py-2 text-lg tracking-tight text-slate-900"
                                  )}
                                >
                                  Your Profile
                                </Link>
                              )}
                            </Menu.Item>

                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  href="/settings/avatars"
                                  className={clsx(
                                    active ? "bg-gray-100" : "",
                                    "block px-4 py-2 text-lg tracking-tight text-slate-900"
                                  )}
                                >
                                  Your Avatars
                                </Link>
                              )}
                            </Menu.Item>
                            <hr className="m-2 border-slate-300/40" />
                            <Menu.Item>
                              {({ active }) => (
                                <div
                                  role="button"
                                  className={clsx(
                                    active ? "bg-gray-100" : "",
                                    "block px-4 py-2 text-lg tracking-tight text-slate-900"
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
              <div className="flex items-center gap-x-5 md:gap-x-8">
                <Button href="/signin" color="blue">
                  <span>
                    Get started <span className="hidden lg:inline">today</span>
                  </span>
                </Button>

                <div className="hidden md:block">
                  <NavLink href="/signin">Sign in</NavLink>
                </div>
              </div>
            )}
            <div className="-mr-1 md:hidden">
              <MobileNavigation />
            </div>
          </div>
        </nav>
      </Container>
    </header>
  );
}
