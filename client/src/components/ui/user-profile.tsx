import { User } from "@/types";

interface UserProfileProps {
  user: User;
}

export default function UserProfile({ user }: UserProfileProps) {
  return (
    <section className="w-full max-w-lg mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 flex items-center justify-between">
      <div className="flex items-center">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold">
          <span>{user.initials}</span>
        </div>
        <div className="ml-3">
          <h2 className="font-display font-semibold">{user.name}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {user.testsCompleted} tests completed
          </p>
        </div>
      </div>
      <div>
        <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 text-xs font-semibold px-2.5 py-0.5 rounded-full">
          Rank: {user.rank}
        </span>
      </div>
    </section>
  );
}
