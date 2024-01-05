import { Entity, Verifications } from "@prisma/client"

export type VerificationsWithEntity = Verifications & {
    entity: Entity
}
