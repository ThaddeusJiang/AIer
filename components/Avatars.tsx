import { DefaultAvatar } from "./ui/Avatar/DefaultAvatar";

export function Avatars({
  avatars
}: {
  avatars: {
    id: string;
    username: string;
    name: string;
    avatar_url: string;
    desc?: string;
    twitterUrl?: string;
    linkedinUrl?: string;
  }[];
}) {
  return (
    <section id="avatars" aria-label="Pricing" className="bg-white py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Public Avatars</h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Talking with the AIer anytime, without worrying about their availability.
          </p>
        </div>
        <ul
          role="list"
          className="mx-auto mt-20 grid  place-content-around max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 xl:grid-cols-4"
        >
          {avatars.map((avatar) => (
            <li className="mx-auto" key={avatar.id}>
              <DefaultAvatar avatar={avatar} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
