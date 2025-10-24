import { Suspense } from "react";
import Details from "./details";

export default function DetailsPage() {
    return (
        <Suspense
            fallback={
                <div
                    style={{
                        textAlign: "center",
                        padding: "80px 0",
                        fontSize: "18px",
                        color: "#A31157",
                    }}
                >
                    Loading product details...
                </div>
            }
        >
            <Details />
        </Suspense>
    );
}
