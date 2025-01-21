# Procedural animated fish

# Behaviour explanation

```ts
function update() {
  if (points.length > 1) {
    // Check if there are more than one points
    const p0 = points[0]; // Get the first point
    if (p0.targetX !== null && p0.targetY !== null) {
      // Check if the first point has target coordinates
      const dx = p0.targetX - p0.x; // Calculate the difference in x
      const dy = p0.targetY - p0.y; // Calculate the difference in y
      const distance = Math.sqrt(dx * dx + dy * dy); // Calculate the distance to the target

      if (distance > 1) {
        // If the distance is greater than 1
        p0.xSpeed = (dx / distance) * 2; // Set the x speed proportionally to the distance
        p0.ySpeed = (dy / distance) * 2; // Set the y speed proportionally to the distance
      } else {
        p0.xSpeed = 1; // Set a default x speed
        p0.ySpeed = 1; // Set a default y speed
        p0.targetX = null; // Clear the target x
        p0.targetY = null; // Clear the target y
      }
    }

    const p1 = points[1]; // Get the second point
    let newX = p0.x + p0.xSpeed; // Calculate the new x position of the first point
    let newY = p0.y + p0.ySpeed; // Calculate the new y position of the first point
    let angle = Math.atan2(p1.y - p0.y, p1.x - p0.x); // Calculate the angle between the first and second point
    p1.x = p0.x + Math.cos(angle) * DESIRED_DISTANCE; // Set the x position of the second point at the desired distance from the first point
    p1.y = p0.y + Math.sin(angle) * DESIRED_DISTANCE; // Set the y position of the second point at the desired distance from the first point
    let movementAngle = Math.atan2(p0.ySpeed, p0.xSpeed); // Calculate the movement angle of the first point

    if (
      newX - DESIRED_DISTANCE <= 0 ||
      newX + DESIRED_DISTANCE >= WIDTH ||
      newY - DESIRED_DISTANCE <= 0 ||
      newY + DESIRED_DISTANCE >= HEIGHT
    ) {
      let angleAdjustment = Math.PI / 180; // Set a small angle adjustment
      if (newX - DESIRED_DISTANCE <= 0 || newX + DESIRED_DISTANCE >= WIDTH) {
        movementAngle = Math.PI - movementAngle; // Adjust the movement angle if hitting left or right boundary
      }
      if (newY - DESIRED_DISTANCE <= 0 || newY + DESIRED_DISTANCE >= HEIGHT) {
        movementAngle = -movementAngle; // Adjust the movement angle if hitting top or bottom boundary
      }
      movementAngle += angleAdjustment; // Apply the angle adjustment
      const speed = Math.sqrt(p0.xSpeed * p0.xSpeed + p0.ySpeed * p0.ySpeed); // Calculate the speed
      p0.xSpeed = Math.cos(movementAngle) * speed; // Set the new x speed
      p0.ySpeed = Math.sin(movementAngle) * speed; // Set the new y speed
    } else {
      p0.x = newX; // Update the x position
      p0.y = newY; // Update the y position
    }
  }

  for (let i = 2; i < points.length; i++) {
    // Loop through the rest of the points
    const p0 = points[i - 2]; // Get the previous second point
    const p1 = points[i - 1]; // Get the previous point
    const p2 = points[i]; // Get the current point
    const angle1 = Math.atan2(p1.y - p0.y, p1.x - p0.x); // Calculate the angle between p0 and p1
    const angle2 = Math.atan2(p2.y - p1.y, p2.x - p1.x); // Calculate the angle between p1 and p2
    let diffAngle = angle2 - angle1; // Calculate the difference in angles

    if (diffAngle > PI)
      diffAngle -= 2 * PI; // Adjust angle if difference is greater than PI
    else if (diffAngle < -PI) diffAngle += 2 * PI; // Adjust angle if difference is less than -PI

    if (Math.abs(diffAngle) > MAX_ANGLE) {
      // Check if the angle difference exceeds maximum allowed
      const newAngle = angle1 + Math.sign(diffAngle) * MAX_ANGLE; // Adjust the new angle within the maximum allowed
      p2.x = p1.x + Math.cos(newAngle) * DESIRED_DISTANCE; // Set the new x position of the current point
      p2.y = p1.y + Math.sin(newAngle) * DESIRED_DISTANCE; // Set the new y position of the current point
    } else {
      const dx = p1.x - p2.x; // Calculate the difference in x
      const dy = p1.y - p2.y; // Calculate the difference in y
      const distance = Math.sqrt(dx * dx + dy * dy); // Calculate the distance between p1 and p2
      if (distance !== DESIRED_DISTANCE) {
        // Check if the distance is not the desired distance
        const angle = Math.atan2(dy, dx); // Calculate the angle between p1 and p2
        p2.x = p1.x - Math.cos(angle) * DESIRED_DISTANCE; // Adjust the x position of p2 to the desired distance from p1
        p2.y = p1.y - Math.sin(angle) * DESIRED_DISTANCE; // Adjust the y position of p2 to the desired distance from p1
      }
    }
  }
}
```
