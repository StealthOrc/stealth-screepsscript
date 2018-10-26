module.exports = {
    // a function to run the logic for this role
    run: function(creep, numberOfMiners, numberMyCreeps, currEnergy, energy) {
        var source = Game.getObjectById(creep.memory.sourceID);
        var container = source.pos.findInRange(FIND_STRUCTURES,1, {
            filter: (s) => s.structureType == STRUCTURE_CONTAINER
        })[0];
        // if creep is bringing energy to the spawn or an extension but has no energy left
        if (creep.memory.working == true && !creep.pos.isEqualTo(container.pos)) {
            // switch state
            creep.memory.working = false;
        }
        // if creep is at his destination
        else if (creep.memory.working == false && creep.pos.isEqualTo(container.pos)) {
            // switch state
            creep.memory.working = true;
        }
        // if creep is supposed to WÖRK
        if (creep.memory.working == true) {
            if(container.store[RESOURCE_ENERGY] < container.storeCapacity){
                if(container.hits < container.hitsMax && creep.carry.energy >= 40){
                    if(creep.repair(container) == ERR_NOT_ENOUGH_RESOURCES){
                        creep.harvest(source);
                    }
                }else{
                    // WÖRK WÖRK WÖRK
                    creep.harvest(source);
                    // creep.say('WÖRKING');
                }
            }
            else{
                creep.say('full');
            }
        }
        // if creep is supposed to go to WÖRK (not WÖRKING at the moment [atm])
        else {
            creep.moveTo(container,{visualizePathStyle: {stroke: '#ffffff'}});
            creep.say('moving');
        }
    }
};
