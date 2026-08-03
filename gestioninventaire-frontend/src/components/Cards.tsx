type CardProps = {
    title: string;
    value: number;
};

export default function Card({ title, value }: CardProps) {
    return (
        <div>
            <h2>{title}</h2>
            <p>{value}</p>
        </div>
    );
}