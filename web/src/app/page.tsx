import Image from "next/image";
import GymTable from '@/components/gymTable'

export default function Home() {
  return (
    <main className="p-6 font-mono">
      <h1 className="text-2xl font-bold border-b pb-2 mb-4">
        Tokyo Climbing Gym Index
      </h1>
      {/* TODO: add a filter component */}
      <p>A minimalist database for climbers training hard in Tokyo.</p>

      <GymTable />
    </main>
  );
}
