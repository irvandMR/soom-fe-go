import PageHeader from "@/components/widget/PageHeader";
import { useState } from "react";

function ListUnitComponent() {
	const [showAddModal, setShowAddModal] = useState(false);
	return (
		<>
			<PageHeader
				title="Units"
				subtitle=" 10 Unit terdaftar"
				actionLabel="Tambah Unit"
				onAction={() => setShowAddModal(true)}
			/>
		</>
	);
}

export default ListUnitComponent;
