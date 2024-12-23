import { UnprocessableEntityException } from "@nestjs/common";

export default class Period {
    public constructor(
        public readonly from: Date,
        public readonly to: Date
    ) {
        if (from.getTime() > to.getTime()) {
            throw new UnprocessableEntityException("The provided period is inconsistent. Caused by the 'from' param is greater than the 'to' param.")
        }
    }
}