import { Roles } from "../shared/constants"
import { CustomerIcon, DistributorIcon, ManufacturerIcon, RetailerIcon } from "../shared/icons"

export const getRoleIcon = (role: Roles) => {
	switch (role.toLowerCase()) {
		case Roles.DISTRIBUTOR:
			return <DistributorIcon className="h-10 fill-primary w-10" />
		case Roles.MANUFACTURER:
			return <ManufacturerIcon className="h-10 fill-primary w-10" />
		case Roles.RETAILER:
			return <RetailerIcon className="h-10 fill-primary w-10" />
		case Roles.CUSTOMER:
			return <CustomerIcon className="h-10 fill-primary w-10" />
		default:
			return <CustomerIcon className="h-10 fill-primary w-10" />
	}
}
