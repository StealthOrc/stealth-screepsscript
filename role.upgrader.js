module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
        // if creep is bringing energy to the controller but has no energy left
        if (creep.memory.working == true && creep.carry.energy == 0) {
            // switch state
            creep.memory.working = false;
        }
        // if creep is harvesting energy but is full
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            // switch state
            creep.memory.working = true;
        }

        // if creep is supposed to transfer energy to the controller
        if (creep.memory.working == true) {
            // instead of upgraderController we could also use:
            // if (creep.transfer(creep.room.controller, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {

            // try to upgrade the controller
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                // if not in range, move towards the controller
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#0114ff'}});
            }
        }
        // if creep is supposed to harvest energy from source
        else {
            var structure = creep.pos.findClosestByPath(FIND_STRUCTURES,{
                filter: (s) => (
                   (s.structureType == STRUCTURE_CONTAINER && (s.store[RESOURCE_ENERGY] >= creep.carryCapacity || s.store[RESOURCE_ENERGY] == s.storeCapacity))
                || ((s.structureType == STRUCTURE_EXTENSION) && (s.energy >= creep.carryCapacity || s.energy == s.energyCapacity))
            )})
            // console.log(structure);
            // console.log('upgrader:creep.withdraw(structure,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE):'+creep.withdraw(structure,RESOURCE_ENERGY));
            if (structure == null || (creep.withdraw(structure,RESOURCE_ENERGY) != ERR_NOT_IN_RANGE)){
                structure = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
                // try to harvest energy, if the source is not in range
                if (creep.harvest(structure) == ERR_NOT_IN_RANGE) {
                // move towards the source
                creep.moveTo(structure);
                }
            }
            if(creep.withdraw(structure,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                if(creep.pos.findInRange(FIND_DROPPED_RESOURCES,1,{filter: (r) => r.resourceType == RESOURCE_ENERGY}).length > 0){
                    creep.pickup(creep.pos.findInRange(FIND_DROPPED_RESOURCES,1,{filter: (r) => r.resourceType == RESOURCE_ENERGY})[0]);
                    creep.say('pickup');
                }else{
                    creep.moveTo(structure);
                }
            }
        }
    }
}
