"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"
import { addMonths, subMonths } from "date-fns"

import "react-day-picker/dist/style.css"
import { cn } from "@/src/lib/utils"
import { buttonVariants } from "@/src/components/ui/button"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export function Calendar() {
  const [month, setMonth] = React.useState(new Date())
  const [label, setLabel] = React.useState("")

  const handlePrevious = () => setMonth((prev) => subMonths(prev, 1))
  const handleNext = () => setMonth((prev) => addMonths(prev, 1))

  // ✅ Evita hydration mismatch usando useEffect
 React.useEffect(() => {
  setLabel(format(month, "MMMM yyyy", { locale: es }))
}, [month])

  return (
    <div>
      <div className="flex justify-between items-center px-4 mb-2">
        <button
          onClick={handlePrevious}
          className={cn(buttonVariants({ variant: "outline" }), "h-7 w-7 p-0")}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-sm font-medium">{label}</span>
        <button
          onClick={handleNext}
          className={cn(buttonVariants({ variant: "outline" }), "h-7 w-7 p-0")}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <DayPicker
        month={month}
        onMonthChange={setMonth}
        showOutsideDays
        className="p-3"
        classNames={{
          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          month: "space-y-4",
          table: "w-full border-collapse space-y-1",
          head_row: "flex",
          head_cell:
            "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
          row: "flex w-full mt-2",
          cell: "h-9 w-9 text-center text-sm p-0 relative",
          day: cn(
            buttonVariants({ variant: "ghost" }),
            "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
          ),
          day_selected:
            "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          day_today: "bg-accent text-accent-foreground",
          day_outside:
            "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
          day_disabled: "text-muted-foreground opacity-50",
          day_hidden: "invisible",
        }}
      />
    </div>
  )
}
