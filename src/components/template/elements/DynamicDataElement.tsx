export interface DynamicDataElementProps<T> {
  data: T;
}

export function DynamicDataElement({ data }: DynamicDataElementProps<object>) {
  return (
    <div>
      <ul>
        {Object.entries(data).map((entry) => (
          <li key={entry[0]}>
            {entry[0]}: {entry[1]}
          </li>
        ))}
      </ul>
    </div>
  );
}
