/**
 * Created by Bob Jiang on 2015/3/17.
 */
module vo {
    /**
     * 由冒险者构成的团队
     */
    export class Team {
        public venturers:Venturer[];

        public get isEmpty():boolean {
            return !this.venturers || this.venturers.length > 0;
        }

        /**
         * 获取本队的队长
         * @returns {null}
         */
        public get leader():Venturer {
            return this.isEmpty ? null : this.venturers[0];
        }

        public constructor() {
            this.venturers = [];
        }
    }
}