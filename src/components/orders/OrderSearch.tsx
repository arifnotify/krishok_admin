"use client";

interface Props {
  value: string;
  onChange: (
    value: string
  ) => void;
}

export default function OrderSearch({
  value,
  onChange,
}: Props) {
  return (
    <input
      value={value}
      onChange={(e) =>
        onChange(
          e.target.value
        )
      }
      placeholder="Search Order..."
      className="
      w-full
      border
      rounded-xl
      p-3
      "
    />
  );
}