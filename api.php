<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once 'db.php';
$database = new Database();
$db = $database->getConnection();

// Obtener la acción de la URL (si existe)
$action = isset($_GET['action']) ? $_GET['action'] : '';

// Identificar el método HTTP
$method = $_SERVER['REQUEST_METHOD'];


switch ($method) {
    case 'GET':
        switch($action) {
            case 'get-emp':
            $nombre = $_GET['nombre'] ?? '';
            $query = $db->prepare("SELECT lat, lng FROM emp WHERE nombreemp = :nombre");
            $query->bindParam(':nombre', $nombre);
            $query->execute();
            $result = $query->fetch(PDO::FETCH_ASSOC);
            echo json_encode($result);

                break;
            case 'list-emp':
                $query = $db->prepare("SELECT * FROM emp");
                $query->execute();
                $result = $query->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($result);
                
                break;
    
            case 'list-users':
                $query = $db->prepare("SELECT * FROM users");
                $query->execute();
                $result = $query->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($result);
                break;
    
            default:
                // Manejo de error en caso de acción no encontrada
                http_response_code(400); // Código de error
                echo json_encode(["success" => false, "message" => "Acción no válida"]);
                break;
        }
        break;
    
    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        
        switch ($action) {
            case 'login':
                // Login
                $query = $db->prepare("SELECT * FROM users WHERE email = :email AND password = :password");
                $query->bindParam(':email', $data->email);
                $query->bindParam(':password', $data->password);
                $query->execute();
                
                if ($user = $query->fetch(PDO::FETCH_ASSOC)) {
                    $token = bin2hex(random_bytes(16));
                    echo json_encode([
                        "success" => true,
                        "user" => $user,
                        "token" => $token
                    ]);
                } else {
                    http_response_code(401);
                    echo json_encode(["success" => false, "message" => "Credenciales inválidas"]);
                }
                break;

            case 'register':
                // Registro
                $query = $db->prepare("INSERT INTO users (nombre, email, password) VALUES (:nombre, :email, :password)");
                $query->bindParam(':nombre', $data->nombre);
                $query->bindParam(':email', $data->email);
                $query->bindParam(':password', $data->password);
                
                if ($query->execute()) {
                    $userId = $db->lastInsertId();
                    $token = bin2hex(random_bytes(16));
                    
                    $user = [
                        "id" => $userId,
                        "nombre" => $data->nombre,
                        "email" => $data->email,
                    ];
                    
                    echo json_encode([
                        "success" => true,
                        "user" => $user,
                        "token" => $token
                    ]);
                } else {
                    http_response_code(400);
                    echo json_encode(["success" => false, "message" => "Error al registrar usuario"]);
                }
                break;
                case 'registeremp':
                    // Registro}

                    $query = $db->prepare("INSERT INTO emp (nombreemp, numero,lat ,lng) VALUES (:nombreemp, :numero, :lat, :lng)");
                    $query->bindParam(':nombreemp', $data->nombreemp);
                    $query->bindParam(':numero', $data->numero);
                    $query->bindParam(':lat', $data->lat);
                    $query->bindParam(':lng', $data->lng);

                    if ($query->execute()) {                        
                        // Datos de respuesta basados en los datos insertados
                        $emp = [
                            "id" => $userId,
                            "nombreemp" => $data->nombreemp,
                            "numero" => $data->numero,
                        ];
                        
                        echo json_encode([
                            "success" => true,
                            "emp" => $emp,
                            "token" => $token
                        ]);
                    } else {
                        http_response_code(400);
                        echo json_encode(["success" => false, "message" => "Error al registrar el empleado"]);
                    }
                    break;

                    case 'registerobj':
                        // Registro
                        $query = $db->prepare("INSERT INTO obj (nombreobj, descobj) VALUES (:nombreobj, :descobj)");
                        $query->bindParam(':nombreobj', $data->nombreobj);
                        $query->bindParam(':descobj', $data->descobj);
                        
                        if ($query->execute()) {                        
                            // Datos de respuesta basados en los datos insertados
                            $emp = [
                                "id" => $userId,
                                "nombreobj" => $data->nombreobj,
                                "descobj" => $data->descobj,
                            ];
                            
                            echo json_encode([
                                "success" => true,
                                "emp" => $emp,
                                "token" => $token
                            ]);
                        } else {
                            http_response_code(400);
                            echo json_encode(["success" => false, "message" => "Error al registrar el empleado"]);
                        }
                        break;
            
            case 'change-password':
                // Cambio de contraseña
                $query = $db->prepare("UPDATE users SET password = :newPassword WHERE email = :email AND password = :oldPassword");
                $query->bindParam(':email', $data->email);
                $query->bindParam(':oldPassword', $data->oldPassword);
                $query->bindParam(':newPassword', $data->newPassword);
                
                if ($query->execute() && $query->rowCount() > 0) {
                    echo json_encode(["success" => true, "message" => "Contraseña actualizada"]);
                } else {
                    http_response_code(400);
                    echo json_encode(["success" => false, "message" => "Error al actualizar contraseña"]);
                }
                break;

            case 'check-email':
                // Verificar si el correo electrónico existe
                $query = $db->prepare("SELECT COUNT(*) as count FROM users WHERE email = :email");
                $query->bindParam(':email', $data->email);
                $query->execute();
                $result = $query->fetch(PDO::FETCH_ASSOC);
                
                echo json_encode(["exists" => $result['count'] > 0]);
                break;

            case 'reset-password':
                // Restablecer la contraseña
                $query = $db->prepare("UPDATE users SET password = :newPassword WHERE email = :email");
                $query->bindParam(':email', $data->email);
                $query->bindParam(':newPassword', $data->newPassword);
                
                if ($query->execute() && $query->rowCount() > 0) {
                    echo json_encode(["success" => true, "message" => "Contraseña restablecida"]);
                } else {
                    http_response_code(400);
                    echo json_encode(["success" => false, "message" => "Error al restablecer la contraseña"]);
                }
                break;

            default:
                // Crear nuevo usuario (cuando no hay acción específica)
                $query = $db->prepare("INSERT INTO users (nombre, email, password) VALUES (:nombre, :email, :password)");
                $query->bindParam(':nombre', $data->nombre);
                $query->bindParam(':email', $data->email);
                $query->bindParam(':password', $data->password);
                
                if ($query->execute()) {
                    echo json_encode(["success" => true, "message" => "Usuario creado"]);
                } else {
                    http_response_code(400);
                    echo json_encode(["success" => false, "message" => "Error al crear usuario"]);
                }
                break;
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"));
        $query = $db->prepare("UPDATE users SET nombre = :nombre, email = :email, password = :password WHERE id = :id");
        $query->bindParam(':nombre', $data->nombre);
        $query->bindParam(':email', $data->email);
        $query->bindParam(':password', $data->password);
        $query->bindParam(':id', $data->id);
        
        if ($query->execute()) {
            echo json_encode(["success" => true, "message" => "Usuario actualizado"]);
        } else {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Error al actualizar usuario"]);
        }
        break;

    case 'DELETE':
        $data = json_decode(file_get_contents("php://input"));
        $query = $db->prepare("DELETE FROM users WHERE id = :id");
        $query->bindParam(':id', $data->id);
        
        if ($query->execute()) {
            echo json_encode(["success" => true, "message" => "Usuario eliminado"]);
        } else {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Error al eliminar usuario"]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["message" => "Método no permitido"]);
        break;
}
?>