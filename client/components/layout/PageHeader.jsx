"use client";

export default function PageHeader({

    title,

    subtitle,

    action,

}) {

    return (

        <div className="mb-10 flex items-center justify-between">

            <div>

                <h1 className="text-4xl font-black tracking-tight text-white">

                    {title}

                </h1>

                {subtitle && (

                    <p className="mt-2 text-gray-400">

                        {subtitle}

                    </p>

                )}

            </div>

            {action && action}

        </div>

    );

}