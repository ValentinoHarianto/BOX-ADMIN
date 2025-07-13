'use client'

import { useState } from "react";
import { Store } from "@prisma/client";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useStore } from "zustand";
import { useStoreModal } from "@/hooks/use-store-modal";
import { useParams, useRouter } from "next/navigation";
import { set } from "zod";
import { Button } from "./ui/button";
import { Check, ChevronsUpDown, PlusCircle, Store as StoreIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandList, CommandSeparator } from "./ui/command";
import { CommandItem } from "cmdk";

type PopOverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface StoreSwitcherProps extends PopOverTriggerProps {
    items: Store[];
}


const StoreSwitcher = ({
    className,
    items = [],
    
}: StoreSwitcherProps) => {
    const storeModal = useStoreModal();
    const params = useParams();
    const router = useRouter();

    const formattedItems = items.map((item) => ({
        label: item.name,
        value: item.id
    }))

    const currentStore = formattedItems.find((item) => item.value === params.storeId)

    const [open, setOpen] = useState(false)

    const onStoreSelect = (store: {value: string, label: string}) => {
        setOpen(false);
        router.push(`/${store.value}`)
    }

    return ( 
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                variant="outline"
                size="sm"
                role="combobox"
                aria-expanded={open}
                aria-label="Chose Store"
                className={cn("w-[200px] justify-between", className)}
                >
                    <StoreIcon className="mr-2 h-4 w-4" />
                    {currentStore?.label}
                    <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverTrigger>
                <PopoverContent className="w-[200px] p-0" side="bottom" align="end" sideOffset={24} >
                    <Command>
                        <CommandList>
                            <CommandInput placeholder="Search"/>
                            <CommandEmpty>
                                Store is empty
                            </CommandEmpty>
                            <CommandGroup heading="Store">
                                {formattedItems.map((store) => (
                                    <CommandItem
                                    key={store.value}
                                    onSelect={() => onStoreSelect(store)}
                                    className="text-sm px-3 py-2 flex items-center"
                                    >
                                        <StoreIcon className="mr-2 h-5 w-5 "/>
                                        {store.label}
                                        <Check 
                                        className={cn(
                                            "ml-auto h-5 w-5",
                                            currentStore?.value === store.value ? "opacity-100" : "opacity-0"
                                        )}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                        <CommandSeparator />
                            <CommandList>
                                <CommandGroup>
                                    <CommandItem
                                    onSelect={() => {
                                        setOpen(false);
                                        storeModal.onOpen();
                                    }}
                                    className="text-base px-3 py-2 flex items-center"
                                    >
                                        <PlusCircle className="mr-2 h-5 w-5"/>
                                        New Store
                                    </CommandItem>
                                </CommandGroup>
                            </CommandList>
                    </Command>
                </PopoverContent>
            </PopoverTrigger>

        </Popover>
    );
}

export default StoreSwitcher;