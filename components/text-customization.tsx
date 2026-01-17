import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

// 字体选项
const fontFamilies = [
  { label: "默认", value: "system-ui" },
  { label: "宋体", value: "SimSun" },
  { label: "微软雅黑", value: "Microsoft YaHei" },
  // ... 其他字体选项
]

export function TextCustomization() {
  return (
    <div className="flex gap-2">
      {/* 字体下拉菜单 */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-[150px] justify-between">
            <span>选择字体</span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {fontFamilies.map((font) => (
            <DropdownMenuItem key={font.value}>
              {font.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 字号下拉菜单 */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-[100px] justify-between">
            <span>字号</span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {[12, 14, 16, 18, 20, 24].map((size) => (
            <DropdownMenuItem key={size}>
              {size}px
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 标题级别下拉菜单 */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-[100px] justify-between">
            <span>标题</span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].map((heading) => (
            <DropdownMenuItem key={heading}>
              {heading}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
} 