import { PlusCircle, X } from "lucide-react";
import React, { useState } from "react";
import { Button } from "./components/ui/button";
import { Checkbox } from "./components/ui/checkbox";
import { Input } from "./components/ui/input";

const BillSplitCalculator = () => {
  const [categories, setCategories] = useState([]);
  const [people, setPeople] = useState([]);

  const addCategory = () => {
    const newId = categories.length + 1;
    setCategories([
      ...categories,
      { id: newId, name: `Category ${newId}`, amount: "" },
    ]);
    setPeople(
      people.map((person) => ({
        ...person,
        participation: [...person.participation, false],
      }))
    );
  };

  const addPerson = () => {
    const newId = people.length + 1;
    setPeople([
      ...people,
      {
        id: newId,
        name: `Person ${newId}`,
        participation: categories.map(() => false),
      },
    ]);
  };

  const removeCategory = (id) => {
    setCategories(categories.filter((cat) => cat.id !== id));
    setPeople(
      people.map((person) => ({
        ...person,
        participation: person.participation.filter(
          (_, index) => categories[index].id !== id
        ),
      }))
    );
  };

  const removePerson = (id) => {
    setPeople(people.filter((person) => person.id !== id));
  };

  const updateCategory = (id, field, value) => {
    setCategories(
      categories.map((cat) =>
        cat.id === id ? { ...cat, [field]: value } : cat
      )
    );
  };

  const updatePersonParticipation = (personId, categoryIndex, value) => {
    setPeople(
      people.map((person) =>
        person.id === personId
          ? {
              ...person,
              participation: person.participation.map((p, idx) =>
                idx === categoryIndex ? value : p
              ),
            }
          : person
      )
    );
  };

  const calculateTotal = (personId) => {
    return categories.reduce((total, category, index) => {
      const person = people.find((p) => p.id === personId);
      if (person && person.participation[index]) {
        const amount = parseFloat(category.amount) || 0;
        const participantsCount = people.filter(
          (p) => p.participation[index]
        ).length;
        return total + amount / participantsCount;
      }
      return total;
    }, 0);
  };

  const grandTotal = categories.reduce(
    (sum, category) => sum + (parseFloat(category.amount) || 0),
    0
  );

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Bill Split Calculator</h2>
      <div className="bg-yellow-100 p-4 mb-4 rounded-md">
        <h3 className="font-semibold">How to use:</h3>
        <p>
          Click on names or categories to edit. Use the '+' buttons to add new
          people or categories. Check the boxes to indicate participation. The
          calculator will automatically split the bill based on participation.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2 min-w-[150px]">Person</th>
              {categories.map((category) => (
                <th key={category.id} className="border p-2 min-w-[120px]">
                  <div className="flex items-center justify-between">
                    <Input
                      value={category.name}
                      onChange={(e) =>
                        updateCategory(category.id, "name", e.target.value)
                      }
                      className="w-full mr-2"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCategory(category.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <Input
                    type="text"
                    value={category.amount}
                    onChange={(e) =>
                      updateCategory(category.id, "amount", e.target.value)
                    }
                    placeholder="0"
                    className="w-full mt-2"
                  />
                </th>
              ))}
              <th className="border p-2 min-w-[150px]">
                <Button
                  onClick={addCategory}
                  variant="outline"
                  size="sm"
                  className="whitespace-nowrap w-full"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </th>
              <th className="border p-2 min-w-[100px]">Total</th>
            </tr>
          </thead>
          <tbody>
            {people.map((person) => (
              <tr key={person.id}>
                <td className="border p-2">
                  <div className="flex items-center justify-between">
                    <Input
                      value={person.name}
                      onChange={(e) =>
                        setPeople(
                          people.map((p) =>
                            p.id === person.id
                              ? { ...p, name: e.target.value }
                              : p
                          )
                        )
                      }
                      className="w-full mr-2"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removePerson(person.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
                {categories.map((category, index) => (
                  <td key={category.id} className="border p-2 text-center">
                    <Checkbox
                      checked={person.participation[index]}
                      onCheckedChange={(checked) =>
                        updatePersonParticipation(person.id, index, checked)
                      }
                    />
                  </td>
                ))}
                <td className="border p-2"></td>
                <td className="border p-2 font-semibold">
                  €{calculateTotal(person.id).toFixed(2)}
                </td>
              </tr>
            ))}
            <tr>
              <td className="border p-2">
                <Button
                  onClick={addPerson}
                  variant="outline"
                  size="sm"
                  className="whitespace-nowrap w-full"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Person
                </Button>
              </td>
              {categories.map((category) => (
                <td
                  key={category.id}
                  className="border p-2 font-semibold text-right"
                >
                  €
                  {parseFloat(category.amount)
                    ? parseFloat(category.amount).toFixed(2)
                    : "0.00"}
                </td>
              ))}
              <td className="border p-2"></td>
              <td className="border p-2 font-semibold text-right">
                €{grandTotal.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BillSplitCalculator;
