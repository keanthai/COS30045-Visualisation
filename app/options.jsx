
const countries = ["Afghanistan","Algeria","Armenia","Azerbaijan","Bangladesh","Benin","Bolivia","Bosnia and Herzegovina","Brazil","Burkina Faso","Burundi,Cameroon"
,"Central African Republic","Chad","Colombia","Congo","Côte d'Ivoire","Cyprus","Dem. Rep. Congo","Egypt","Eritrea","Ethiopia","Georgia","Ghana","Guatemala","Haiti","Honduras","India","Indonesia"
,"Iraq","Kenya","Kosovo","Kyrgyzstan","Lebanon","Liberia","Libya","Madagascar","Malawi","Mali","Mayotte","Mexico","Mozambique","Myanmar","Nepal","New Caledonia","Niger","Nigeria","North Macedonia","Pakistan","Palestine","Papua New Guinea","Peru","Philippines"
,"Russia","Russian Federation","Senegal","Serbia","Sierra Leone","Solomon Islands","Somalia","South Africa","South Sudan","Sri Lanka","Sudan","Syria","Thailand","Timor-Leste","Togo","Tunisia","Türkiye","Turkmenistan"
,"Uganda","Ukraine","Uzbekistan","Yemen"];


export const options = countries.map((item)=> {return {label: item, value: item};})