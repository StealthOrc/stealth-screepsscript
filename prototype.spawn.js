module.exports = function() {
    StructureSpawn.prototype.setMinRoles =
        function(){
            if(this.memory.varsSet == undefined){
                var minHarvesters = 2;
                var minUpgraders = 2;
                var sources = Game.spawns.Spawn1.room.find(FIND_SOURCES);
                var minMiners = sources.length;
                var minCouriers = minMiners;
                var minBuilders = 2;
                var minRepairers = 2;
                var minLDHarvesterW26N12 = 1;
                var minLDHarvesterW25N11 = 1;
                this.memory.minHarvesters = minHarvesters;
                this.memory.minUpgraders = minUpgraders;
                this.memory.sources = sources;
                this.memory.minMiners = this.memory.sources.length;
                this.memory.minCouriers = this.memory.minMiners;
                this.memory.minRepairers = minRepairers;
                this.memory.minContainerRepairers = this.memory.minRepairers;
                this.memory.varsSet = true;
            }
        }
    // create a new function for StructureSpawn
    StructureSpawn.prototype.spawnCustomCreep =
        function(energy, roleName) {
            // create a balanced body as big as possible with the given energy
            var cName = roleName + Game.time;
            if (energy > 3200) { energy = 3200}
            var numberOfParts = Math.floor(energy / 200);
            var body = [];
            for (let i = 0; i < numberOfParts; i++) {
                body.push(WORK);
            }
            for (let i = 0; i < numberOfParts; i++) {
                body.push(CARRY);
            }
            for (let i = 0; i < numberOfParts; i++) {
                body.push(MOVE);
            }

            // create creep with the created body and the given role
            // console.log(body);
            return this.spawnCreep(body, cName, { memory: {
                role: roleName,
                working: false
            }});
        };
    StructureSpawn.prototype.spawnMiner =
        function(sourceID, energy, roleName){
            var cName = roleName + Game.time;
            if(energy >= 800){
                return this.spawnCreep([WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,MOVE], cName, {memory:
                    { role: 'miner',
                      working: false,
                      sourceID: sourceID }});
            }
            else if(energy < 800){
                return this.spawnCreep([WORK,WORK,CARRY,MOVE], cName, {memory:
                    { role: 'miner',
                      working: false,
                      sourceID: sourceID }});
            }
        }
    StructureSpawn.prototype.spawnCourier =
        function(containerID, energy, roleName){
            var cName = roleName + Game.time;
            if(energy >= 800){
                return this.spawnCreep([CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,WORK,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], cName,{memory:
                    { role: 'courier',
                      working: false,
                      containerID: containerID }});
            }
            else if(energy < 800){
                return this. spawnCreep([CARRY,CARRY,WORK,MOVE,MOVE], cName,{memory: {
                    role: 'courier',
                    working: false,
                    containerID: containerID }});
            }
        }
    StructureSpawn.prototype.spawnLongDistanceHarvester =
        function (numberOfWorkParts, home, target, sourceIndex) {
            var cName = roleName + Game.time;
            var energy = this.room.energyCapacityAvailable;
            // create a body with the specified number of WORK parts and one MOVE part per non-MOVE part
            var body = [];
            for (let i = 0; i < numberOfWorkParts; i++) {
                body.push(WORK);
                body.push(MOVE);
            }

            // 150 = 100 (cost of WORK) + 50 (cost of MOVE)
            energy -= 150 * numberOfWorkParts;

            var numberOfParts = Math.floor(energy / 50);
            for (let i = 0; i < numberOfParts; i++) {
                body.push(CARRY);
            }

            // create creep with the created body
            return this.spawnCreep(body, cName, {
                role: 'ldHarvester',
                home: home,
                target: target,
                sourceIndex: sourceIndex,
                working: false
            });
        };
    StructureSpawn.prototype.spawnUpgrader =
        function(){
            var cName = 'upgrader' + Game.time;
            var energy = this.room.energyCapacityAvailable;
            if(energy >= 500){
                // create creep with the created body and the given role
                var body = [CARRY, CARRY, WORK, MOVE, MOVE]
                return this.spawnCreep(body, cName, {memory:
                    { role: 'upgrader',
                      working: false }});
            }else{
                var body = [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,WORK,MOVE,MOVE]
                return this.createCreep(body,cName,{memory:
                    { role: 'upgrader',
                      working: false}})
            }
        }
        StructureSpawn.prototype.spawnContainerRepairer =
            function(containerID){
                var cName = 'containerRepairer' + Game.time;
                var energy = this.room.energyCapacityAvailable;
                // create a balanced body as big as possible with the given energy
                var numberOfParts = Math.floor(energy/200);
                var body = [];
                for (let i = 0; i < numberOfParts; i++) {
                    body.push(CARRY);
                    body.push(CARRY);
                    body.push(WORK);
                }
                energy = energy - numberOfParts * 200
                if (energy < 50){
                    body.splice(body.length-1,1);
                }
                    body.push(MOVE);
                    // create creep with the created body and the given role
                    return this.spawnCreep(body, cName, {memory: {
                        role: 'containerRepairer',
                        working: false,
                        containerID: containerID
                    }});
            }
    StructureSpawn.prototype.getMinLDHarvesters =
        function(){
            let spawn = this;
            let exits = this.room.find(FIND_EXIT);
            if(exits.length > 0){
                let exitDirections = [FIND_EXIT_BOTTOM,FIND_EXIT_LEFT,FIND_EXIT_TOP,FIND_EXIT_RIGHT];
                for(let directionIndex in exitDirections){
                    if(spawn.room.find(exitDirections[directionIndex]).length > 0){
                        minLDHarvester = minLDHarvester+1
                    }
                }
            }
            this.memory.minLDHarvester = minLDHarvester;
        }

};
