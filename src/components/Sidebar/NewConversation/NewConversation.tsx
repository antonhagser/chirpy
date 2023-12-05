"use client";

import dynamic from "next/dynamic";
import styles from "./NewConversation.module.css";
import { useId, useState } from "react";
import { MessageSquarePlus } from "lucide-react";
import { useAuth } from "@/context/auth.context";
import { createConversation } from "@/server/conversation";

// ! This is a hack to fix the SSR issue with react-select
// ! https://github.com/JedWatson/react-select/issues/5459
const AsyncSelect = dynamic(() => import("react-select/async"), { ssr: false });

const customStyles = {
    menu: (provided: any) => ({
        ...provided,
        backgroundColor: "var(--tertiary)",
        color: "var(--text-light-2)",
    }),
    control: (provided: any) => ({
        ...provided,
        backgroundColor: "transparent",
        borderColor: "transparent",
        boxShadow: "none",
        "&:hover": {
            borderColor: "transparent",
        },
        width: "100%",
        paddingTop: "0.2rem",
        paddingBottom: "0.2rem",
        minWidth: "0",
        maxWidth: "100%",
    }),
    valueContainer: (provided: any) => ({
        ...provided,
        display: "inline-flex",
        flexWrap: "nowrap",
        overflow: "hidden",
    }),
    multiValue: (provided: any) => ({
        ...provided,
        backgroundColor: "var(--tertiary)",
        float: "left",
        flexShrink: 0,
    }),
    multiValueLabel: (provided: any) => ({
        ...provided,
        color: "var(--text-light)",
        maxWidth: "60px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
    }),
    multiValueRemove: (provided: any) => ({
        ...provided,
        color: "var(--text-light)",
        cursor: "pointer",
        "&:hover": {
            backgroundColor: "var(--tertiary)",
            color: "var(--text-light)",
        },
    }),
};

export default function NewConversation() {
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    async function queryUsers(inputValue: string) {
        let response = await fetch(`/api/users?query=${inputValue}`);
        if (!response.ok) {
            throw new Error("Something went wrong");
        }

        return await response.json();
    }

    const handleChange = (options: any) => {
        if (selectedOptions.length > 3) {
            return;
        }

        // Only take 3 options
        setSelectedOptions(options.slice(0, 3));
    };

    const handleSubmit = async (event: any) => {
        event.preventDefault();

        if (isLoading) return;

        setIsLoading(true);

        // Get the user ids from the selected options
        const userIds = selectedOptions.map((option: any) => option.value);

        try {
            await createConversation(userIds);
        } catch (error) {
            setIsLoading(false);
            console.error(error);
            return;
        }

        setIsLoading(false);
        setSelectedOptions([]);
    };

    return (
        <div className={styles.newConversation}>
            <div className={styles.newTitleHeader}>
                <h3 className={styles.newTitle}>New conversation</h3>
            </div>
            <div className={styles.new}>
                <form className={styles.newForm} onSubmit={handleSubmit}>
                    <div className={styles.newInput}>
                        <AsyncSelect
                            id={Date.now().toString()}
                            instanceId={useId()}
                            isMulti
                            name="names"
                            theme={(theme) => ({
                                ...theme,
                                borderRadius: 4,
                                colors: {
                                    ...theme.colors,
                                    primary25: "var(--tertiary)", // color for the option hover state
                                    primary: "var(--primary)", // color for the selected option
                                    neutral0: "var(--background)", // color for the select background
                                    neutral20: "var(--border)", // color for the select border
                                    neutral50: "var(--text-dark)", // color for the placeholder text
                                    neutral80: "var(--text-dark)", // color for the input text
                                },
                            })}
                            isOptionDisabled={() => selectedOptions.length >= 3}
                            cacheOptions
                            isClearable={false}
                            loadOptions={queryUsers}
                            onChange={handleChange}
                            value={selectedOptions}
                            styles={customStyles}
                            placeholder="Search for users..."
                            captureMenuScroll
                            loadingMessage={() => "Loading..."}
                            noOptionsMessage={({ inputValue }) => {
                                if (selectedOptions.length >= 3) {
                                    return "You can only select 3 users";
                                } else if (!inputValue) {
                                    return "Start typing to search";
                                } else {
                                    return "No results found";
                                }
                            }}
                        />
                    </div>
                    <button className={styles.newSubmit} type="submit">
                        {isLoading ? (
                            <span className={styles.spinner}></span>
                        ) : (
                            <MessageSquarePlus />
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
