import { InputText } from "primereact/inputtext";

const SearchGlobal = ({ setGlobalFilter }) => {
    return (
        <div className="flex flex-column md:flex-row justify-content-end align-items-center mb-2">
        <InputText
            className="w-full md:w-3 mb-2 md:mb-0"
            type="search"
            onInput={(e) => setGlobalFilter(e.target.value)}
            placeholder="Tìm kiếm"
        />
    </div>
    )
}
export default SearchGlobal;