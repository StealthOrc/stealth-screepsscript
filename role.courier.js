module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
        const pathColor = '#1cd5fe';
        var container = Game.getObjectById(creep.memory.containerID);
        // True = bringing back energy (transfering)
        if (creep.memory.working == true && creep.carry.energy == 0) {
            // switch state
            creep.memory.working = false;
        }
        // if creep is collecting energy but is full
        else if(creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            // switch state
            creep.memory.working = true;
        }
        // if creep is supposed to transfer energy to the spawn or an extension
        if (creep.memory.working == true) {
            // find closest spawn or extension which is not full
            var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                // the second argument for findClosestByPath is an object which takes
                // a property called filter which can be a function
                // we use the arrow operator to define it
                filter: (s) => (s.structureType == STRUCTURE_SPAWN
                             || s.structureType == STRUCTURE_EXTENSION)
                             && s.energy < s.energyCapacity
            });
            // if we found one
            if (structure != null) {
                if(structure != undefined){
                	// try to transfer energy, if it is not in range
                	if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
		                creep.moveTo(structure,{visualizePathStyle: {stroke: pathColor}});
		                // creep.say('moving');
    		        }
       			}
            }
        }
        // if creep is supposed to collect energy from container
        else {
            if(creep.withdraw(container,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                // if there is energy dropped just pick it up, otherwise just continuer working
                if(creep.pos.findInRange(FIND_DROPPED_RESOURCES,1,{filter: (r) => r.resourceType == RESOURCE_ENERGY}).length > 0){
                    creep.pickup(creep.pos.findInRange(FIND_DROPPED_RESOURCES,1,{filter: (r) => r.resourceType == RESOURCE_ENERGY})[0]);
                    creep.say('pickup');
                }
                else{
                    creep.moveTo(container, {visualizePathStyle: {stroke: pathColor}});
                    // creep.say('withdraw')
                }
            }
        }
    }
};
